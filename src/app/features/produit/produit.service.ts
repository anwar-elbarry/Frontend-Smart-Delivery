import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environment/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProduitRequest} from './models/produit.request';
import {Observable} from 'rxjs';
import {ProduitResponse} from './models/produit.response';
import {PageRequest} from '../../core/models/page.request.model';
import {PageResponse} from '../../core/models/page.response.model';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/produits`;

  /**
   * Create a new produit
   * POST /api/produits
   */
  create(dto: ProduitRequest): Observable<ProduitResponse> {
    return this.http.post<ProduitResponse>(this.baseUrl, dto);
  }

  /**
   * Get all produits (Paginated)
   * GET /api/produits?page=0&size=10&sort=name,asc
   */
  getAll(request: PageRequest): Observable<PageResponse<ProduitResponse>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('size', request.size.toString());

    // Handle sorting if present
    if (request.sort) {
      request.sort.forEach(sortItem => {
        params = params.append('sort', sortItem);
      });
    }

    return this.http.get<PageResponse<ProduitResponse>>(this.baseUrl, { params });
  }

  /**
   * Get produit by id
   * GET /api/produits/{id}
   */
  getById(id: string): Observable<ProduitResponse> {
    return this.http.get<ProduitResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Update produit
   * PUT /api/produits/{id}
   */
  update(id: string, dto: ProduitRequest): Observable<ProduitResponse> {
    return this.http.put<ProduitResponse>(`${this.baseUrl}/${id}`, dto);
  }

  /**
   * Delete produit
   * DELETE /api/produits/{id}
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
