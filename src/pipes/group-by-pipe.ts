import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the GroupByPipe pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'groupbypipe',
  pure: false
})
@Injectable()
export class GroupByPipe {
  transform(items: Array<any>, conditions: {[field: string]: any}): Array<any> {
    return items.filter(item => {
        for (let field in conditions) {
            if (item[field] !== conditions[field]) {
                return false;
            }
        }
        return true;
    });
  }
}
