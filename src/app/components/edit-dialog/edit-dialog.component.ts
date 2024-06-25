import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Contact, Task } from '../board/board.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../../enviroments/enviroments';
import { lastValueFrom } from 'rxjs';

interface DialogData {
  id: number;
}

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent implements OnInit {
  taskForm!: FormGroup;
  task!: Task;
  contacts: Contact[] = []

  constructor(
    private dialogRef: MatDialogRef<EditDialogComponent>,
    private http: HttpClient,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const url = `${enviroment.apiUrl}/tasks/${this.data.id}/`;
      this.task = await lastValueFrom(this.http.get<Task>(url));
      console.log(this.task); 
      this.loadContacts();
      this.initializeForm();
    } catch (error) {
      console.error('Fehler beim Laden der Aufgabe', error);
    }
  }

  initializeForm(): void {
    this.taskForm = this.fb.group({
      title: [this.task.title, Validators.required],
      description: [this.task.description, Validators.required],
      due_date: [this.task.due_date, Validators.required],
      assignee: [this.task.assignee, Validators.required],
      status: [this.task.status, Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editTask() {
    if (this.taskForm.valid) {
      const updatedTask: Task = { ...this.task, ...this.taskForm.value };
      const url = `${enviroment.apiUrl}/tasks/${this.data.id}/`;

      this.http.put<Task>(url, updatedTask).subscribe({
        next: (response) => {
          console.log('Task updated successfully: ', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error updating task: ', error);
        }
      });
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
