import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZoneService } from '../../zone.service';
import { ZoneRequest } from '../../models/zone.request';
import { ZoneResp } from '../../models/zone.response';

@Component({
  selector: 'app-zone-update',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './zone-update.html',
  styleUrl: './zone-update.css',
})
export class ZoneUpdate {
  private zoneService = inject(ZoneService);

  @Input() selectedZone: ZoneResp | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onZoneUpdated = new EventEmitter<ZoneResp>();

  closeEditModal() {
    this.onClose.emit();
  }

  updateZone() {
    if (this.selectedZone && this.selectedZone.nome && this.selectedZone.codePostal) {
      const zoneRequest: ZoneRequest = {
        nome: this.selectedZone.nome,
        codePostal: this.selectedZone.codePostal
      };

      this.zoneService.update(this.selectedZone.id, zoneRequest).subscribe({
        next: (updatedZone) => {
          this.onZoneUpdated.emit(updatedZone);
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error updating zone:', error);
        }
      });
    }
  }
}
