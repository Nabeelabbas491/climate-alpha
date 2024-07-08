import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, merge, fromEvent, timer, Subscription, interval } from 'rxjs';
import { switchMap, takeUntil, mapTo } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Toast } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {

  public minutes: number;
  public seconds: number;

  private subscription: Subscription;

  private readonly TIMER_DURATION = 60 * 15;
  private remainingTime: number;

  constructor(private auth: AuthService) {
    this.startTimer();

    const activityEvents$ = merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'keydown'),
      fromEvent(window, 'scroll'),
      fromEvent(window, 'touchstart'),
      fromEvent(window, 'contextmenu')
    );

    activityEvents$.subscribe(() => { this.resetTimer(0) })
  }

  startTimer() {
    if (this.subscription && !this.subscription.closed) return;

    this.remainingTime = this.TIMER_DURATION

    const timer$ = interval(1000);

    this.subscription = timer$.subscribe(() => {

      this.remainingTime--;

      if (this.remainingTime < 0) {
        this.stopTimer();
      } else {
        this.updateTimeDisplay();
      }

    });
  }

  stopTimer() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  resetTimer(newTime: number) {
    this.stopTimer(); // Stop any existing timer
    this.remainingTime = newTime; // Reset the time
    this.startTimer(); // Start the timer again
  }

  updateTimeDisplay(): void {
    this.minutes = Math.floor(this.remainingTime / 60);
    this.seconds = this.remainingTime % 60;
    if (this.minutes == 0 && this.seconds == 0) {
      this.auth.logout('You have been logged out due to inactivity. Please login again.')
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

}
