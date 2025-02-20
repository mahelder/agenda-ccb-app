import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonButton,
  IonIcon,
  IonImg
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState, useCallback } from 'react';
import './Churches.css';
import ChurchesFilterModal from './ChurchesFilterModal';
import { search } from 'ionicons/icons';

const Churches: React.FC = () => {
  const [churches, setChurches] = useState<{ [key: string]: any }>({});
  const [churchesShown, setChurchesShown] = useState<{ [key: string]: any }>({});
  const [filters, setFilters] = useState({ events: [], days: [], search: '' });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    loadChurches();
  }, []);

  const loadChurches = () => {
    const db = getDatabase();
    const churchesRef = ref(db, '/churches');
    onValue(churchesRef, (snapshot) => {
      addListChurches(snapshot);
    });
  };

  const addListChurches = (entity: any) => {
    let churchesData: { [key: string]: any } = {};
    entity.forEach((element: any) => {
      churchesData[element.key] = element.val();
      churchesData[element.key]['key'] = element.key;
    });

    churchesData = Object.fromEntries(
      Object.entries(churchesData).sort(([, a], [, b]) => {
        let orderA = a.order ? parseInt(a.order) : Number.MAX_SAFE_INTEGER;
        let orderB = b.order ? parseInt(b.order) : Number.MAX_SAFE_INTEGER;
        if (orderA > orderB) return 1;
        if (orderA < orderB) return -1;
        return a.place.localeCompare(b.place) || a.name.localeCompare(b.name);
      })
    );

    setChurches(churchesData);
    setChurchesShown(churchesData);
    setLoading(false);
  };

  const createListItems = () => {
    let html: any[] = [];
    for (let church in churchesShown) {
      html.push(
        <IonItem routerLink={`/churches/${church}`} key={church}>
          <IonCard className="welcome-card">
            <IonImg className="main-img" src={churchesShown[church].imgUrl} />
            <IonCardHeader>
              <IonCardTitle>{churchesShown[church].place} - {churchesShown[church].name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Cultos: {churchesShown[church].cults}</p>
              <p>{churchesShown[church].code ? `Código: ${churchesShown[church].code}` : ""}</p>
            </IonCardContent>
          </IonCard>
        </IonItem>
      );
    }
    return html;
  };

  const searchFilter = (filters: any) => {
    let filteredChurches = Object.keys(churches).map(i => churches[i]);

    if (filters.events.includes("cults")) {
      filteredChurches = filteredChurches.filter(i => i.cults.includes(filters.days));
    }

    if (filters.events.includes("rehearsals")) {
      filteredChurches = filteredChurches.filter(i => i.rehearsals !== undefined && i.rehearsals.weekDay.includes(filters.days));
    }

    filteredChurches = filteredChurches.filter(i => i.name.toLowerCase().includes(filters.search));
    const churchesShownData = filteredChurches.reduce((acc: any, church: any) => {
      acc[church.key] = church;
      return acc;
    }, {});

    setChurchesShown(churchesShownData);
    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear" onClick={() => setShowModal(true)}>
            <IonIcon slot="icon-only" icon={search}></IonIcon>
          </IonButton>
          <IonTitle>Franca-SP e Região</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <ChurchesFilterModal showModal={showModal} filters={filters} search={searchFilter} />
        <IonLoading isOpen={loading} />
        <IonList lines="none">
          {createListItems()}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Churches;
