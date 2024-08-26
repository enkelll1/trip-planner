import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(req: RegisterUserDto): Promise<{ ok: true }> {
    if (req.password != req.repeatPassword) {
      throw new BadRequestException('Password mismatch');
    }

    const userAlreadyExists = await this.userModel.findOne({
      email: req.email,
    });
    if (userAlreadyExists) {
      throw new ConflictException('This user already exists');
    }

    await this.userModel.create({
      username: req.username,
      email: req.email,
      password: await bcrypt.hash(req.password, 10),
    });
    return { ok: true };
  }

  async signIn(req: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(req);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const payload = {
      id: user._id,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);
    return {
      accessToken: token,
    };
  }

  private async validateUser(req: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.userModel.findOne({ email: req.email });
    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(req.password, user.password);
    if (valid) {
      return user;
    }

    return null;
  }
}
