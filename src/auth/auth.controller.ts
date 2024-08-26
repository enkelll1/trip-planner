import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({
    type: RegisterUserDto,
    description: 'Json structure for user object',
  })
  async register(@Body() body: RegisterUserDto): Promise<{ ok: true }> {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({
    type: LoginUserDto,
    description: 'Json structure for user object',
  })
  async signIn(@Body() body: LoginUserDto) {
    return this.authService.signIn(body);
  }
}
