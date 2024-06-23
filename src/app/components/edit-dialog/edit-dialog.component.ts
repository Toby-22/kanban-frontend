import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, inject } from '@angular/core';
import { Task } from '../board/board.component';
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
  styleUrl: './edit-dialog.component.scss',
})
export class EditDialogComponent {
  taskForm!: FormGroup;
  task!: Task;

  constructor(
    private dialogRef: MatDialogRef<EditDialogComponent>,
    private http: HttpClient,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}



  ngOnInit(): void {
    const url = enviroment.apiUrl + `/tasks/${this.data.id}/`;
    this.http.get<Task>(url).subscribe({
      next: (task) => {
        this.task = task;
        console.log(this.task); 
        this.initializeForm();
      },
      error: (error) => {
        console.error('Fehler beim Laden der Aufgabe', error);
      }
    });
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
    this.dialogRef.close(true);
  }
}
