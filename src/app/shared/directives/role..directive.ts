import { Directive, ElementRef, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Role } from '../data/roles';

@Directive({
  selector: '[Role]'
})
export class RoleDirective {

  @Input() elementRoles: Array<string | number>;
  @Input() nodeName: string;
  protected hasAccess: boolean

  constructor(private _elementRef: ElementRef, private _authService: AuthService) { }

  ngOnInit() {
    this.hasAccess = Role.isAllowedToPerformAction(this._authService.admin, this.elementRoles)
    switch (this.nodeName) {
      case 'lock-icon':
        !this.hasAccess ? '' : (this._elementRef.nativeElement as HTMLElement).style.display = 'none'
        break;
      case 'display':
        this.hasAccess ? '' : (this._elementRef.nativeElement as HTMLElement).style.display = 'none'
    }
  }

}
