// src/modules/auth/admin-auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminAuthService {
    private readonly ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    private readonly ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    

  validateAdmin(email: string, password: string): boolean {
    return email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD;
  }

  login(email: string, password: string) {
    if (this.validateAdmin(email, password)) {
      return {
        success: true,
        message: 'Admin login successful!',
        admin: { email: this.ADMIN_EMAIL },
        token: 'admin_dummy_token'
      };
    }
    throw new UnauthorizedException('Invalid admin credentials');
  }
}
