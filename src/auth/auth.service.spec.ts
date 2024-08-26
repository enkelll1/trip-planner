import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken('User'));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw a BadRequestException if passwords do not match', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        repeatPassword: 'differentpassword',
      };

      await expect(authService.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a ConflictException if the user already exists', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        repeatPassword: 'password',
      };

      (userModel.findOne as jest.Mock).mockResolvedValueOnce({});

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should successfully register a user', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        repeatPassword: 'password',
      };

      (userModel.findOne as jest.Mock).mockResolvedValueOnce(null);
      (userModel.create as jest.Mock).mockResolvedValueOnce({});

      const result = await authService.register(registerDto);

      expect(result).toEqual({ ok: true });
      expect(userModel.create).toHaveBeenCalledWith({
        username: registerDto.username,
        email: registerDto.email,
        password: expect.any(String), // because the password is hashed
      });
    });
  });

  describe('signIn', () => {
    it('should throw an UnauthorizedException if the user is not found', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };

      (
        jest.spyOn(authService as any, 'validateUser') as jest.Mock
      ).mockResolvedValueOnce(null);
      await expect(authService.signIn(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return an access token if credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user: User = {
        createdAt: undefined,
        updatedAt: undefined,
        username: 'testUsername',
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      (
        jest.spyOn(authService as any, 'validateUser') as jest.Mock
      ).mockResolvedValueOnce(user as User);
      (jwtService.sign as jest.Mock).mockReturnValueOnce('accessToken');

      const result = await authService.signIn(loginDto);

      expect(result).toEqual({ accessToken: 'accessToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user._id,
        email: user.email,
      });
    });
  });

  describe('validateUser', () => {
    it('should return null if the user is not found', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };

      (userModel.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService['validateUser'](loginDto);

      expect(result).toBeNull();
    });

    it('should return the user if credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user: User = {
        createdAt: undefined,
        updatedAt: undefined,
        username: 'testUsername',
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (userModel.findOne as jest.Mock).mockResolvedValueOnce(user as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const result = await authService['validateUser'](loginDto);

      expect(result).toEqual(user);
    });

    it('should return null if the password is invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user: User = {
        createdAt: undefined,
        updatedAt: undefined,
        username: 'testUsername',
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (userModel.findOne as jest.Mock).mockResolvedValueOnce(user as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      const result = await authService['validateUser'](loginDto);

      expect(result).toBeNull();
    });
  });
});
