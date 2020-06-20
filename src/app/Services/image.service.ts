import {Injectable} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {
  }


  public uploadImage(image: File): Observable<any> {
    const formData = new FormData();

    formData.append('file', image);

    return this.http.post('http://localhost:5001/upload_image_to_db', formData);
  }
  public uploadDetectImage(image: File): Observable<any> {
    const formData = new FormData();

    formData.append('file', image);

    return this.http.post('http://localhost:5001/facial_recognition', formData);
  }
}
