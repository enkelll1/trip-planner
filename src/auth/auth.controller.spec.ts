import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../user/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register and return the result', async () => {
      const req: RegisterUserDto = {
        username: 'test',
        email: 'test@test.com',
        password: 'password',
        repeatPassword: 'password',
      };
      const result: { ok: true } = { ok: true };

      jest.spyOn(service, 'register').mockResolvedValue(result);

      expect(await controller.register(req)).toBe(result);
    });
  });

  describe('signIn', () => {
    it('should call AuthService.signIn and return the result', async () => {
      const req: LoginUserDto = {
        email: 'test@test.com',
        password: 'password',
      };
      const result = { accessToken: 'testToken' };

      jest.spyOn(service, 'signIn').mockResolvedValue(result);

      expect(await controller.signIn(req)).toBe(result);
    });
  });
});
