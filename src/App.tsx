import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendar, person, home } from 'ionicons/icons';
import Churches from './pages/Churches';
import ChurchDetails from './pages/ChurchDetails';
import Agendas from './pages/Agendas';
import MinistersSections from './pages/MinistersSections';
import Ministers from './pages/Ministers';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/churches" exact={true}>
            <Churches />
          </Route>
          <Route path="/churches/:id">
            <ChurchDetails />
          </Route>
          <Route exact path="/ministers">
            <MinistersSections />
          </Route>
          <Route path="/ministers/:section">
            <Ministers />
          </Route>
          <Route path="/agendas">
            <Agendas />
          </Route>
          <Route exact path="/">
            <Redirect to="/churches" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/churches">
            <IonIcon aria-hidden="true" icon={home} />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/ministers">
            <IonIcon aria-hidden="true" icon={person} />
          </IonTabButton>
          <IonTabButton tab="tab3" href="/agendas">
            <IonIcon aria-hidden="true" icon={calendar} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
