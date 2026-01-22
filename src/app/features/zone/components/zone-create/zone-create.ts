import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZoneService } from '../../zone.service';
import { ZoneRequest } from '../../models/zone.request';
import { ZoneResp } from '../../models/zone.response';

@Component({
  selector: 'app-zone-create',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './zone-create.html',
  styleUrl: './zone-create.css',
})
export class ZoneCreate {
  private zoneService = inject(ZoneService);

  @Input() selectedZone: ZoneResp = {
    id: '',
    nome: '',
    codePostal: 0
  };

  @Output() onClose = new EventEmitter<void>();
  @Output() onZoneCreated = new EventEmitter<ZoneResp>();

  closeCreateModal() {
    this.onClose.emit();
  }

  createZone() {
    if (this.selectedZone.nome && this.selectedZone.codePostal) {
      const zoneRequest: ZoneRequest = {
        nome: this.selectedZone.nome,
        codePostal: this.selectedZone.codePostal
      };

      this.zoneService.create(zoneRequest).subscribe({
        next: (newZone) => {
          this.onZoneCreated.emit(newZone);
          this.closeCreateModal();
        },
        error: (error) => {
          console.error('Error creating zone:', error);
        }
      });
    }
  }
}
