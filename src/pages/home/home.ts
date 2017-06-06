import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Observable } from 'rxjs/Observable';
declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {


  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public plt: Platform, public navParams: NavParams, private geolocation: Geolocation, public loadingCtrl: LoadingController, private diagnostic: Diagnostic, private alertCtrl: AlertController) {



  }


  // Load map only after view is initialized
  ngAfterViewInit() {


    //if android

    if (this.plt.is('ios')) {

      this.diagnostic.isLocationEnabled().then((Res) => {
        this.loadMap();
      }).catch(err => {
        let alert = this.alertCtrl.create({
          title: 'Location Failed',
          subTitle: 'Please Enable your GPS or use Default Location',
          buttons: ['Dismiss']
        });
        alert.present();

      })


    } else if (this.plt.is('android')) {



      this.diagnostic.isLocationEnabled().then((res) => {
        console.log(res)
        this.loadMap();
      }).catch((err) => {
        console.log(err);
        
        let alert = this.alertCtrl.create({
          title: 'Location Failed',
          message: 'Please Enable your GPS or use Default Location',
          buttons: [
            {
              text: 'Settings',
  
              handler: () => {
                this.diagnostic.switchToLocationSettings();
              }
            },
            {
              text: 'Cancel',
              handler: () => {
                this.loadMap();
              }
            }
          ]
        });
        alert.present();

       
      })





    }
    else {
      this.loadMap();
    }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }



  loadMap() {
    this.map =  this.createmap(6.927079, 79.861243);

    this.getCurrentLocation().subscribe((res) =>{
     this.map.panTo(res);
    })


  }

  createmap(lat: any, lng: any) {
    console.log("creating map");
    let latLng = new google.maps.LatLng(lat, lng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#181818"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1b1b1b"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#2c2c2c"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8a8a8a"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#373737"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3c3c3c"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#4e4e4e"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3d3d3d"
            }
          ]
        }
      ],
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    return this.map;
  }

 





  getCurrentLocation() {
    let loading = this.loadingCtrl.create({
      content: 'Locating....'
    });

    loading.present();


    let geooptions = { timeout: 10000, enableHighAccuracy: true };

    let locationobs = Observable.create((observable) => {
      this.geolocation.getCurrentPosition(geooptions).then((pos) => {


        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;


        let loc = new google.maps.LatLng(lat, lng);

        observable.next(loc);
        loading.dismiss();



      }).catch((err) => {
        loading.dismiss();
        console.log("Error Location " );
        console.log(err);
      })
    })

    return locationobs;


  }


centerLocation(location){
  if(location){
     this.map.panTo(location);
  }else{
    this.getCurrentLocation().subscribe((res) =>{
     this.map.panTo(res);
    })
  }
}
}
