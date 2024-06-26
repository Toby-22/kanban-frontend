import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardComponent, User } from '../board/board.component';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { enviroment } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent implements OnInit{
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BoardComponent>,
    private http: HttpClient,
  ) {}


  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      const url = enviroment.apiUrl + '/register/';

      this.http.post<User>(url, user).subscribe(
        (response) => {
          console.log('User created successfully: ', response);
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error creating user: ', error);
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }
}
