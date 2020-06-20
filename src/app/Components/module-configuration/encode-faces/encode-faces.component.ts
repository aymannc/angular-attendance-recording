import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../../../Services/api.service';

@Component({
  selector: 'app-encode-faces',
  templateUrl: './encode-faces.component.html',
  styleUrls: ['./encode-faces.component.css']
})
export class EncodeFacesComponent implements OnInit {

  isLoading = false;
  isError: string = null;
  results: any = null;

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  ngOnInit(): void {
  }

  requestNewFacesEncoding() {
    this.isLoading = true;
    console.log('Submitted');
    this.http.get(this.apiService.pythonApiUrl + '/faces_encoding').pipe().subscribe(result => {
        console.log(result);
        this.results = result;
        this.isLoading = false;
      }
      , err => {
        console.log(err);
        this.isError = err.message;
        this.isLoading = false;
      });
  }
}
