import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true; // Agar rol belgilanmagan bo'lsa, ruxsat beriladi
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      return false; // Foydalanuvchi yoki uning ro‘llari bo‘lmasa, rad etiladi
    }

    return roles.some((role) => user.roles.includes(role)); // Userda kerakli rol borligini tekshirish
  }
}
