import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import {ConfirmationService, DialogService, MessageService} from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ConfirmationDialogComponent } from 'src/app/modules/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from 'src/app/modules/confirmation-dialog/confirmation-dialog.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesService } from './services/categories.service';
import { DashboardService } from './services/dashboard.service';
import { JuridictionService } from './services/juridiction.service';
import { LineOfBusinessService } from './services/line-of-business.service';
import { MenuService } from './services/menu.service';
import { PermissionsService } from './services/permissions.service';
import { ReferenceSourceService } from './services/reference-source.service';
import { RuleInfoService } from './services/rule-info.service';
import { StatesService } from './services/states.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { SpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { SettingsDasbhoardComponent } from './shared/components/settings-dasbhoard/settings-dasbhoard.component';
import { HttpErrorInterceptorProvider } from './shared/interceptors/error-handler.interceptor';
import { NumberOnlyDirective } from './shared/directives/numbers-only.directive';
import { PrintService } from './services/print.service';
import { Ecllnterceptor } from './shared/interceptors/ecl-interceptor';
import { ToastMessageService } from './services/toast-message.service';
import { PrintPageComponent } from './shared/components/print-page/print-page.component';
import { TimeoutInterceptor, DEFAULT_TIMEOUT } from './shared/interceptors/timeout-interceptor';
import { BrowserCacheService } from './services/browser-cache.service';
import { DnbInterceptorSevice } from "./modules/dnb/interceptors/dnb-interceptor.service";
import { LoadingSpinnerService } from "./services/spinner.service";
import { ChooseOptionDialogComponentModule } from "./shared/components/choose-option-dialog/choose-option-dialog.module"
import { CanDeactivateGuard } from './shared/guards/can-deactivate.guard';
import { OktaAuthGuard, OktaAuthModule, OktaAuthService, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaHashBasedAuthGuard } from './shared/guards/okta-hash-based.guard';
import { RuntimeConfigService } from './runtime-config.service';
import {ResearchRequestLoginModule} from './shared/components/research-request-login/research-request-login.module';

export function initializeApp(config: RuntimeConfigService) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    ConfirmationDialogComponent,
    SettingsDasbhoardComponent,
    PrintPageComponent,
    NumberOnlyDirective,
    SpinnerComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    OktaAuthModule,
    NgbModule,
    NgxPermissionsModule.forRoot(),
    ToastModule,
    MenuModule,
    DynamicDialogModule,
    TabViewModule,
    TableModule,
    ConfirmDialogModule,
    ChooseOptionDialogComponentModule,
    ResearchRequestLoginModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [RuntimeConfigService, Injector], multi: true },
    {
      provide: OKTA_CONFIG,
      useFactory: (configService: RuntimeConfigService) => {
        return configService.getOktaConfigAsVar();
      },
      deps: [RuntimeConfigService],
      multi: false
    },
    {provide: OktaAuthModule, deps: [RuntimeConfigService, Injector]},
    {provide: OktaAuthGuard, deps: [RuntimeConfigService, Injector]},
    {provide: OktaHashBasedAuthGuard, deps: [OktaAuthService, Injector]},

    HttpErrorInterceptorProvider,
    MenuService,
    CategoriesService,
    JuridictionService,
    LineOfBusinessService,
    ReferenceSourceService,
    RuleInfoService,
    StatesService,
    ConfirmationDialogService,
    PermissionsService,
    MessageService,
    DashboardService,
    ConfirmationService,
    PrintService,
    LoadingSpinnerService,
    ToastMessageService,
    DialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Ecllnterceptor,
      multi: true
    },
    [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
    [{ provide: DEFAULT_TIMEOUT, useValue: 3600000 }],
    BrowserCacheService,
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: DnbInterceptorSevice,
        multi: true,
      },
    ],
    CanDeactivateGuard
  ],
  entryComponents: [ConfirmationDialogComponent, SettingsDasbhoardComponent, PrintPageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
