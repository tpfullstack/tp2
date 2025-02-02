import { Route } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { ArtistsListComponent } from './components/artists-list/artists-list.component';
import { CreateArtistComponent } from './components/create-artist/create-artist.component';
import { EventDetailComponent } from './components/event-details/event-details.component';
import { ArtistDetailComponent } from './components/artist-details/artist-details.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { Error500Component } from './components/error-500/error-500.component';

export const routes: Route[] = [
    {
        path: 'events',
        component: EventListComponent
    },
    {
        path: 'create-event',
        component: CreateEventComponent
    },
    {
        path: 'artists',
        component: ArtistsListComponent
    },
    {
        path: 'events/:id',
        component: EventDetailComponent
    },
    {
        path: 'artists/:id',
        component: ArtistDetailComponent
    },
    {
        path: 'create-artist',
        component: CreateArtistComponent
    },
    {
        path: '',
        redirectTo: '/artists',
        pathMatch: 'full'
    },
    {
        path: 'server-error',
        component: Error500Component
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];