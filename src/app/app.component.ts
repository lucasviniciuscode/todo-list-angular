import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import {CdkDragDrop, CdkDrag, moveItemInArray, DragDropModule} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
	RouterOutlet,
	MatFormFieldModule,
	FormsModule,
	MatButtonModule, 
	MatIconModule,
	MatInputModule,
	MatIconModule,
	ReactiveFormsModule,
	MatCheckboxModule,
	CommonModule,
	DragDropModule, 
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
	form: FormGroup;
	@ViewChildren('inputField') inputFields!: QueryList<ElementRef>;

	constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
	  this.form = this.fb.group({
		todos: this.fb.array([this.createTodo()])
	  });
	}
  
	get todos() {
	  return this.form.get('todos') as FormArray;
	}
  
	createTodo(): FormGroup {
	  return this.fb.group({
		text: '',
		completed: false,
		editable: true
	  });
	}
  
	addItem(position: number) {
		let last = this.todos.at(position) ?? null;
		if(last==null) {
			this.todos.insert(position + 1, this.createTodo());
			this.disableEdition(position+1, true);
		} else if(last.value.text != '' ) {
			this.todos.insert(position + 1, this.createTodo());
			this.disableEdition(position+1, true);
		}

	}
  
	deleteItem(index: number) {
	  this.todos.removeAt(index);
	}

	toggleInput(todo: AbstractControl, indexOut: number) {
		if(todo.value.text != ''){
			todo.get('editable')?.setValue(!todo.value.editable)
			
			this.disableEdition(indexOut)
		} else {
			this.deleteItem(indexOut)
		}
	}

	disableEdition(editItem: number, addedNow: boolean = false) {
		this.todos.controls.forEach((todo, index) => {
			if(todo.value.text == '' && !addedNow) {
				this.todos.removeAt(index);
			}
			if (editItem != index) {
				  todo.get('editable')?.setValue(false);
			}
		});
		
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.todos.controls, event.previousIndex, event.currentIndex);
	}

	onEnter(event: Event) {
		const inputElement = event.target as HTMLElement;
		inputElement.blur(); // Remove o foco do input
	}
}
