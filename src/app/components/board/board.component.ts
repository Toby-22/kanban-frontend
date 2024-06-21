import { Component, OnInit } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Task{
    "id": number,
    "title": string,
    "description": string,
    "created_at": Date,
    "due_date": Date,
    "status": string,
    "category": string,
    "assignee": number
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

  constructor(private http: HttpClient){}

  async ngOnInit() {
      try{
        this.tasks = await this.loadTasks();
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

  // getTasksByStatus(status: string){
  //   return this.tasks.filter(task => task.status === status)
  // }
}
