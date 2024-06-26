import { Component, OnInit, inject } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { AddContactComponent } from '../add-contact/add-contact.component';

export interface Task{
    "id": number,
    "title": string,
    "description": string,
    "created_at": Date,
    "due_date": Date,
    "status": string,
    "category": string,
    "assignee": string
}

export interface User {
  "id": number,
  "username": string,
  "email": string,
  "first_name": string,
  "last_name": string,
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit{
  tasks: Task[] = [];
  todoTasks: Task[] = [];
  inWorkTasks: Task[] = [];
  inReviewTasks: Task[]= [];
  doneTasks: Task[] = [];
  error = '';
  dialog = inject(MatDialog);
  users: User[] = [];

  constructor(private http: HttpClient){}

  async ngOnInit() {
      try{
        this.tasks = await this.loadTasks();
        this.loadUsers();
        console.log(this.tasks);
        this.filterTasks();
      }catch(e){
        this.error = "Fehler beim laden";
      }
  }

  loadTasks(){
    const url = enviroment.apiUrl + '/tasks/';
    return lastValueFrom(this.http.get<Task[]>(url));
  }


  filterTasks() {
    this.todoTasks = this.tasks.filter(task => task.status === 'todo');
    this.inWorkTasks = this.tasks.filter(task => task.status === 'inWork');
    this.inReviewTasks = this.tasks.filter(task => task.status === 'inReview');
    this.doneTasks = this.tasks.filter(task => task.status === 'done');
  }

  addNote(){
    const dialogRef = this.dialog.open(AddDialogComponent);

    dialogRef.afterClosed().subscribe(()=> {
      window.location.reload();
    });
  }

  editTask(id: number){
    const dialogRef = this.dialog.open(EditDialogComponent, {data: {id: id}});

    dialogRef.afterClosed().subscribe(()=> {
      window.location.reload();
    });
  }

  deleteTask(id: number) {
    const url = `${enviroment.apiUrl}/tasks/${id}`;
    this.http.delete(url).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        this.loadTasks();
        window.location.reload();
      },
      error: (error) => {
        console.error('Error deleting task: ', error);
        this.error = 'Fehler beim Löschen der Aufgabe';
      }
    });
  }

  async loadUsers(): Promise<void> {
    try {
      const url = `${enviroment.apiUrl}/users/`;
      this.users = await lastValueFrom(this.http.get<User[]>(url));
      console.log(this.users);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error);
    }
  }
}
