import { NgModule } from '@angular/core';
import { CoreModule } from 'app/core/core.module';
import { NavigationModule } from 'app/navigation/navigation.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from './services/comment.service';
import { CommentListItemComponent } from 'app/comment/components/comment-list-item/comment-list-item.component';
import { CommentListComponent } from 'app/comment/components/comment-list/comment-list.component';

@NgModule({
    imports: [
      CoreModule,
      NavigationModule,
      CommonModule,
      FormsModule
    ],
    providers: [
      CommentService
    ],
    declarations: [
      CommentListItemComponent,
      CommentListComponent
    ],
    exports: [
      CommentListItemComponent,
      CommentListComponent
    ]
  })
export class CommentModule {
}
