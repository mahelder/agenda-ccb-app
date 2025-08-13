import React, { useState, useEffect, useCallback } from 'react';
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonList,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonImg,
  IonCard,
  IonLoading,
  IonicSlides
} from '@ionic/react';
import './ChurchesDetails.css';
import { getDatabase, ref, onValue } from "firebase/database";
import { useParams } from 'react-router-dom';
import { useIonViewWillEnter } from '@ionic/react';
import MinisterDetails from './MinisterDetails';


type MyObject = {
  [key: string]: { descricao: string; secao: string };
};


const ministersPtBr: MyObject = {
  "anciaes": { "descricao": "Ancião", "secao": "ministerio" },
  "diaconos": { "descricao": "Diácono", "secao": "ministerio" },
  "cooperadores-franca": { "descricao": "Cooperador", "secao": "ministerio" },
  "cooperadores-regiao": { "descricao": "Cooperador", "secao": "ministerio" },
  "cooperadores-rjm-franca": { "descricao": "Cooperador RJM", "secao": "ministerio" },
  "cooperadores-rjm-regiao": { "descricao": "Cooperador RJM", "secao": "ministerio" },
  "encarregados-regionais": { "descricao": "Encarregado Regional", "secao": "musica" },
  "encarregados-locais-franca": { "descricao": "Encarregado Local", "secao": "musica" },
  "encarregados-locais-regiao": { "descricao": "Encarregado Local", "secao": "musica" },
  "examinadoras": { "descricao": "Examinadora", "secao": "musica" }
};


const ChurchDetails: React.FC = () => {
  const [church, setChurch] = useState<any>({});
  const [ministers, setMinisters] = useState<any[]>([]);
  const [musicMinisters, setMusicMinisters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [details, setDetails] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>()

  const loadChurch = async () => {
    const db = getDatabase();
    const churchesRef = ref(db, `/churches/${id}`);
    onValue(churchesRef, (snapshot) => {
      setChurch(snapshot.val());
      loadMinisters(snapshot.val())
    }, {
      onlyOnce: true
    });
  };

  const loadMinisters = async (church_obj: any) => {
    const db = getDatabase();
    const listRef = ref(db, `/lista-telefones`);
    onValue(listRef, (snapshot) => {
      const keys = ["anciaes", "diaconos", "cooperadores-franca", "cooperadores-regiao", "cooperadores-rjm-franca", "cooperadores-rjm-regiao", "encarregados-locais-franca", "encarregados-locais-regiao", "encarregados-regionais", "examinadoras"];
      let allMinisters: any[] = [];
      let allMusicMinisters: any[] = [];

      keys.forEach(key => {
        let childs = snapshot.val()[ministersPtBr[key]["secao"]][key];
        for (let i in childs) {
          let insert = false;
          if (church_obj.place !== "Franca - SP") {
            if (childs[i]["comum"] === `${church_obj.name} / ${church_obj.place}`)
              insert = true;
            if (childs[i]["outrasComuns"] && childs[i]["outrasComuns"].includes(`${church_obj.name} / ${church_obj.place}`))
              insert = true;
          } else {
            if (childs[i]["comum"] === church_obj.name)
              insert = true;
            if (childs[i]["outrasComuns"] && childs[i]["outrasComuns"].includes(church_obj.name))
              insert = true;
          }

          if (insert) {
            let obj = childs[i];
            obj['typeKey'] = key;
            obj["type"] = ministersPtBr[key]["descricao"];

            if (ministersPtBr[key]["secao"] === "ministerio")
              allMinisters.push(obj);
            else
              allMusicMinisters.push(obj);
          }
        }
      });

      const typeOrderMinisters = {
        'Ancião': 1,
        'Diácono': 2,
        'Cooperador': 3,
        'Cooperador RJM': 4
      };

      allMinisters.sort((a, b) => {

        const typeA = typeOrderMinisters[a.type as keyof typeof typeOrderMinisters] || Number.MAX_SAFE_INTEGER;
        const typeB = typeOrderMinisters[b.type as keyof typeof typeOrderMinisters] || Number.MAX_SAFE_INTEGER;

        if (typeA !== typeB) {
          return typeA - typeB;
        }

        let orderA = a.order ? parseInt(a.order) : Number.MAX_SAFE_INTEGER;
        let orderB = b.order ? parseInt(b.order) : Number.MAX_SAFE_INTEGER;

        return orderA - orderB || a.nome.localeCompare(b.nome);
      });

      const typeOrderMusicMinisters = {
        'Encarregado Regional': 1,
        'Encarregado Local': 2,
        'Examinadora': 3
      };

      allMusicMinisters.sort((a, b) => {
        const typeA = typeOrderMusicMinisters[a.type as keyof typeof typeOrderMusicMinisters] ?? Number.MAX_SAFE_INTEGER;
        const typeB = typeOrderMusicMinisters[b.type as keyof typeof typeOrderMusicMinisters] ?? Number.MAX_SAFE_INTEGER;

        if (typeA !== typeB) {
          return typeA - typeB;
        }

        let orderA = a.order ? parseInt(a.order) : Number.MAX_SAFE_INTEGER;
        let orderB = b.order ? parseInt(b.order) : Number.MAX_SAFE_INTEGER;

        return orderA - orderB || a.nome.localeCompare(b.nome);
      });

      setMinisters(allMinisters);
      setMusicMinisters(allMusicMinisters);
      setLoading(false)
    }, {
      onlyOnce: true
    });
  };

  useIonViewWillEnter(() => {
    loadChurch();
  })

  const closeMinisterDetails = useCallback(() => {
    setOpen(false);
  }, []);

  const createListMinisters = (ministers_obj: any[]) => {
    return ministers_obj.map((minister, index) => (
      <IonItem key={index} onClick={() => { setOpen(true); setDetails(minister); }}>
        <IonLabel><small>{minister.type}:</small> {minister.nome}</IonLabel>
      </IonItem>
    ));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{church.place} - {church.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading}></IonLoading>
        <MinisterDetails open={open} details={details} close={closeMinisterDetails} />
        <IonList lines="none">
          {church.videoUrl && (
            <IonItem>
              <IonCard>
                <video className="img-details" src={church.videoUrl} controls autoPlay muted />
              </IonCard>
            </IonItem>
          )}

          {!church.videoUrl && (
            <IonItem>
              <IonCard>
                <IonImg className="img-details" src={church.imgUrl} />
              </IonCard>
            </IonItem>
          )}

          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Serviços</IonLabel>
            </IonItemDivider>

            {church.code && (
              <IonItem>
                <p>Código: {church.code}</p>
              </IonItem>
            )}

            <IonItem>
              <p>Cultos: {church.cults}</p>
            </IonItem>

            <IonItem>
              <p>Ensaios: {church.rehearsals ? church.rehearsals.description : null}</p>
            </IonItem>

            <IonItem>
              <p>Reunião de Crianças: {church.rc ? "Sim" : "Não"}</p>
            </IonItem>

            <IonItem>
              <p>Libras: {church.libras ? church.libras : "Não"}</p>
            </IonItem>

            <IonItem href={church.location} target="_blank">
              <p>Como chegar?</p>
            </IonItem>
          </IonItemGroup>

          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Ministério Local</IonLabel>
            </IonItemDivider>
            {createListMinisters(ministers)}
          </IonItemGroup>

          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Ministério Musical</IonLabel>
            </IonItemDivider>
            {createListMinisters(musicMinisters)}
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ChurchDetails;
