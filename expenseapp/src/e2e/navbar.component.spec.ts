import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from '../app/navbar/navbar.component';
import { AuthService } from '../app/services/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create a spy object for the AuthService
    const spy = jasmine.createSpyObj('AuthService', ['logout']);

    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout() when logout is called', () => {
    // Call the logout method
    component.logout();

    // Check if authService.logout() has been called
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
