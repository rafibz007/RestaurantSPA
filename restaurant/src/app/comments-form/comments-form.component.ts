import {Component, Input, OnInit} from '@angular/core';
import {Dish} from "../dish";
import {DishesService} from "../services/dishes.service";
import {Comment} from "../comment";
import {CommentService} from "../services/comment.service";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";

@Component({
  selector: 'app-comments-form',
  templateUrl: './comments-form.component.html',
  styleUrls: ['./comments-form.component.css']
})
export class CommentsFormComponent implements OnInit {

  @Input('id') id !: string

  newComment = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    body: new FormControl('', [
      Validators.required,
      Validators.minLength(50),
      Validators.maxLength(500)
    ]),
    date: new FormControl(''),
  })

  constructor(private commentService : CommentService) {

  }

  ngOnInit(): void {
  }

  onSubmit(form : FormGroupDirective){
    let values = form.value
    if (values.date)
      this.commentService.addCommentToDish(this.id, values.nick, values.name, values.body, values.date)
    else
      this.commentService.addCommentToDish(this.id, values.nick, values.name, values.body)
    this.newComment.reset()
  }

}
