import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardComponent, Contact } from '../board/board.component';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { enviroment } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent implements OnInit{
  contactForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BoardComponent>,
    private http: HttpClient,
  ) {}


  ngOnInit(): void {
    this.contactForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      job_position: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveContact(): void {
    if (this.contactForm) {
      const contact: Contact = this.contactForm.value;
      const url = enviroment.apiUrl + '/contact/';
      
      this.http.post<Contact>(url, contact).subscribe(
        (response) => {
          console.log('Contact created successfully: ', response);
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error creating contact: ', error);
        }
      );
    } else {
      console.log('Form is not valid'); 
    }
  }
}
