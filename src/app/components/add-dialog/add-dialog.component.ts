import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BoardComponent, Contact, Task } from '../board/board.component';
import { enviroment } from '../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';



@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss'
})


export class AddDialogComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BoardComponent>,
    private http: HttpClient,
  ) {}

  contacts!: Contact[];

  ngOnInit(): void {
    this.loadContacts();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      assignee: ['', Validators.required],
      status: ['todo', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      const url = enviroment.apiUrl + '/tasks/';
      
      this.http.post<Task>(url, task).subscribe(
        (response) => {
          console.log('Task created successfully: ', response);
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error creating task: ', error);
        }
      );
    } else {
      console.log('Form is not valid'); 
    }
  }

  async loadContacts(): Promise<void> {
    try {
      const url = `${enviroment.apiUrl}/contact/`;
      this.contacts = await lastValueFrom(this.http.get<Contact[]>(url));
      console.log(this.contacts)
    } catch (error) {
      console.error('Fehler beim Laden der Kontakte:', error);
    }
  }
}