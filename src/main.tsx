import {PetFallback} from './desktop-pet';
import React from 'react';
import {createRoot} from 'react-dom/client';
import Dashboard from './dashboard-v2';
import './forest.css';
createRoot(document.getElementById('root')!).render(new URLSearchParams(location.search).get('pet')==='1'?<PetFallback/>:<Dashboard/>);

if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
