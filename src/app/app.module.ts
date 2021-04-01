import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import {MetaModule} from './meta/meta.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule
  //MatMenuModule
} from '@angular/material';
import { AddProjectComponent } from './projects/add-project/add-project.component';
import {ProjectService} from './projects/project.service';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { ListProjectsComponent } from './projects/list-projects/list-projects.component'
import {MatGridListModule} from '@angular/material/grid-list';
import { FlexLayoutModule, StyleUtils, StylesheetMap, LayoutStyleBuilder, MediaMarshaller, LayoutAlignStyleBuilder, FlexStyleBuilder } from '@angular/flex-layout';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import {MatMenuModule} from '@angular/material/menu'; 

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  { path: 'listprojects', component: ListProjectsComponent },
  { path: 'addprojects', component: AddProjectComponent },  
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'} 
];

@NgModule({
  declarations: [
    AppComponent,
    AddProjectComponent,
    ListProjectsComponent,
    HomeComponent,
    MenuComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MetaModule,
    AppRoutingModule,
    MatGridListModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatMenuModule,
    MatCarouselModule.forRoot()
  ],
  providers: [ProjectService, 
              StyleUtils,
              StylesheetMap,
              LayoutStyleBuilder,
              MediaMarshaller,
              LayoutAlignStyleBuilder,
              FlexStyleBuilder
            ],
  bootstrap: [AppComponent],

  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  
})
export class AppModule { }
