import { Component } from '@angular/core';
import { LogService } from './services/log.service';
import {MatTableDataSource} from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';


const ELEMENT_DATA: any[] = [
  {date: "2019-10-04", level: 'INFO', message: "asdasdasd"}
];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title = 'logs-app';
  logs :any;
  submitted = false;
  displayedColumns: string[] = ['date', 'level', 'message'];
  dataSource: any;
  logForm: FormGroup;

  constructor(private logService: LogService,
              public fb: FormBuilder) {
      this.mainForm();
      console.log(this.logForm.value);
      this.logService.getLogs().subscribe( (response) => {
        this.logs = response;
        this.dataSource = new MatTableDataSource(this.logs);       
        console.log(this.logs);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get myForm(){
    return this.logForm.controls;
  }

  mainForm() {
    this.logForm = this.fb.group({
      level: ['', [Validators.required]],
      message: ['', [Validators.required]],
      date: ['', ]
    })
  }

  onSubmit() {
    this.submitted = true;
    if (!this.logForm.valid) {
      return false;
    } else {
      this.logService.createLog(this.logForm.value).subscribe(
        (res) => {
          this.logService.getLogs().subscribe( (response) => {
            this.logs = response;
            this.dataSource = this.logs;
            this.dataSource = new MatTableDataSource(this.logs);
            this.mainForm();
          
          });
          alert('Log successfully created!');
          console.log('Log successfully created!')
        }, (error) => {
          console.log(error);
        });
    }
  }

}
