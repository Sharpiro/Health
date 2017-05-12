import { Injectable } from '@angular/core';
import * as toastr from 'toastr';
import { INotificationService } from "app/shared/i-notification-service";

@Injectable()
export class ToastrNotificationService implements INotificationService {

  constructor() { }

  public error(message: string): void {
    toastr.error(message, "Error");
  }

  public success(message: string): void {
    toastr.success(message, "Error");
  }
}