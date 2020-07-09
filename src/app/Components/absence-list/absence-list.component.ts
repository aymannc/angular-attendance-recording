import {Component, OnInit} from '@angular/core';
import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from 'ng-zorro-antd/table';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ApiService} from '../../Services/api.service';
import {ActivatedRoute} from '@angular/router';
import {ElementApi} from '../../Data/ElementsResponse';

interface DataItem {
  name: string;
  id: number;
  type: string;
  edit: boolean;
}

interface ColumnItem {
  name: string;
  sortOrder?: NzTableSortOrder;
  sortFn?: NzTableSortFn;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn;
  filterMultiple?: boolean;
  sortDirections?: NzTableSortOrder[];
}

@Component({
  selector: 'app-list-absence',
  templateUrl: './absence-list.component.html',
  styleUrls: ['./absence-list.component.css']
})
export class ListAbsenceComponent implements OnInit {
  listOfColumns: ColumnItem[] = [
    {
      name: 'Name',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name),
    },
    {
      name: 'Absence',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.type.localeCompare(b.type),
      filterMultiple: true,
      listOfFilter: [
        {text: 'Present', value: 'present'},
        {text: 'Absent', value: 'absent'}
      ],
      filterFn: (list: string[], item: DataItem) => list.some(type => item.type.indexOf(type) !== -1)
    },
    {
      name: 'Action',
    }
  ];
  listOfData: DataItem[] = [];
  listOfDisplayData: DataItem[] = [];
  searchValue = '';
  visible = false;
  loading: any;
  weeksList: { absencesHref: string; date: string }[] = [];
  element: ElementApi;
  absencesHref: string;
  pageLoading: boolean;
  notFound = false;
  private elementId: number;

  constructor(private message: NzMessageService, private apiService: ApiService,
              private route: ActivatedRoute) {
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = [...this.listOfData
      .filter((item: DataItem) => item.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1)];
  }

  ngOnInit(): void {
    this.pageLoading = true;
    this.elementId = this.route.snapshot.params.id;
    this.apiService.getElement(null, this.elementId).subscribe(element => {
      this.pageLoading = false;
      this.element = element;
      this.loadWeeks();
    }, () => {
      this.message.error('error');
      this.pageLoading = false;
      this.notFound = true;
    });
  }

  loadDataFromServer(): void {
    if (this.absencesHref) {
      console.log(this.absencesHref);
      this.loading = true;
      this.listOfData = [];
      this.apiService.getAbsencesByHref(this.absencesHref).subscribe(data => {
        this.loading = false;
        data.forEach(element => {
          this.apiService.getStudent(element._links.etudient.href).subscribe(student => {
            this.listOfData.push({
              name: student.nom + ' ' + student.prenom,
              id: element.id,
              type: element.abscente ? 'absent' : 'present',
              edit: false
            });
          }, error => {
            this.loading = false;
            console.log(error);
          }, () => this.listOfDisplayData = [...this.listOfData]);
        });
      }, error => {
        this.loading = false;
        console.log(error);
      }, () => {
        // this.getData();
      });
    }
  }

  createMessage(type: string): void {
    this.message.create(type, `Notification sent successfully to student`);
  }

  startEdit(data: any): void {
    data.edit = true;
  }

  saveEdit(data: any): void {
    data.edit = false;
    this.apiService.editAbsance(data.type === 'absent', data.id)
      .subscribe(() => {
        this.message.success('Updated successfully');
      }, () => {
        this.message.error('Error while updating the state');
      });
  }

  onSelectChange($event: any) {
    this.absencesHref = $event;
    this.loadDataFromServer();
  }

  private loadWeeks() {
    this.apiService.getSeancebyElementId(this.elementId).subscribe(seances => {
      seances.forEach(seance => {
        this.weeksList.push(
          {
            absencesHref: seance._links.abscences.href,
            date: seance.jour
          }
        );
      });
      if (this.weeksList?.length > 0) {
        this.absencesHref = this.weeksList[this.weeksList.length - 1].absencesHref;
        this.loadDataFromServer();
      }
    }, () => {
      this.message.error('Error loading dates');
    });
  }
}
