import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Coordinate, proj, View } from 'openlayers'
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { marker } from './osm-view/marker.image';

declare var ol: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input()
  geoReverseService = 'https://nominatim.openstreetmap.org/reverse?key=iTzWSiYpGxDvhATNtSrqx5gDcnMOkntL&format=json&addressdetails=1&lat={lat}&lon={lon}'

  @Input() givenCoordinates: Coordinate
  @Input()
  width: string
  @Input()
  height: string

  @Input()
  latitude = 20.5937
  @Input()
  longitude = 78.9629

  @Input()
  latitudePointer = 20.5937
  @Input()
  longitudePointer = 78.9629

  @Input()
  showControlsZoom: boolean
  @Input()
  titleZoomIn = 'Zoom in'
  @Input()
  titleZoomOut = 'Zoom out'
  @Input()
  showControlsCurrentLocation: boolean
  @Input()
  titleCurrentLocation = 'Current location'

  @Input()
  showDebugInfo: boolean
  @Input()
  opacity = 1
  @Input()
  zoom = 14

  markerImage = marker

  reverseGeoSub: Subscription = null
  pointedAddress: string
  pointedAddressOrg: string
  position: any
  dirtyPosition

  @Output()
  addressChanged = new EventEmitter<String>()

  constructor(private httpClient: HttpClient, private geoLocationService: GeoLocationService) {
  }

  ngOnInit() {
    if(this.givenCoordinates !== null) {
      this.longitude = this.longitudePointer = this.givenCoordinates[0]
      this.latitude = this.latitudePointer = this.givenCoordinates[1]
      this.reverseGeo()
    }
    
    if (this.showControlsCurrentLocation) {
      this.geoLocationService.getLocation().subscribe((position) => {
        this.position = position
        if (!this.dirtyPosition) {
          this.dirtyPosition = true
          this.longitude = this.longitudePointer = this.position.coords.longitude
          this.latitude = this.latitudePointer = this.position.coords.latitude
        }
      })
    }
  }

  ngOnDestroy() {
    if (this.reverseGeoSub) {
      this.reverseGeoSub.unsubscribe()
    }
  }
  onSingleClick(event) {
    const lonlat = proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
    this.longitudePointer = lonlat[0]
    this.latitudePointer = lonlat[1]
    this.reverseGeo()
  }
  increaseOpacity() {
    this.opacity += 0.1
  }

  decreaseOpacity() {
    this.opacity -= 0.1
  }
  increaseZoom() {
    this.zoom++
  }
  decreaseZoom() {
    this.zoom--
  }

  setCurrentLocation(event) {
    // TODO FIX: setting current location does move the pointer but not the map!!!
    if (this.position) {
      this.longitude = this.longitudePointer = this.position.coords.longitude
      this.latitude = this.latitudePointer = this.position.coords.latitude
      /**
       * Trigger new address change
       */
      this.reverseGeo()
    }
  }

  reverseGeo() {
    const service = (this.geoReverseService || '')
      .replace(new RegExp('{lon}', 'ig'), `${this.longitudePointer}`)
      .replace(new RegExp('{lat}', 'ig'), `${this.latitudePointer}`)
    this.reverseGeoSub = this.httpClient.get(service).subscribe(data => {
      const val = (data || {})

      this.pointedAddressOrg = val['display_name']
      const address = []

      const building = []
      if (val['address']['building']) {
        building.push(val['address']['building'])
      }
      if (val['address']['mall']) {
        building.push(val['address']['mall'])
      }
      if (val['address']['theatre']) {
        building.push(val['address']['theatre'])
      }

      const zip_city = []
      if (val['address']['postcode']) {
        zip_city.push(val['address']['postcode'])
      }
      if (val['address']['city']) {
        zip_city.push(val['address']['city'])
      }
      const street_number = []
      if (val['address']['street']) {
        street_number.push(val['address']['street'])
      }
      if (val['address']['road']) {
        street_number.push(val['address']['road'])
      }
      if (val['address']['footway']) {
        street_number.push(val['address']['footway'])
      }
      if (val['address']['pedestrian']) {
        street_number.push(val['address']['pedestrian'])
      }
      if (val['address']['house_number']) {
        street_number.push(val['address']['house_number'])
      }

      if (building.length) {
        address.push(building.join(' '))
      }
      if (zip_city.length) {
        address.push(zip_city.join(' '))
      }
      if (street_number.length) {
        address.push(street_number.join(' '))
      }

      this.pointedAddress = address.join(', ')

      this.addressChanged.emit(this.pointedAddressOrg)
    })
  }

}
