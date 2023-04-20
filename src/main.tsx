import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { MatchViewer } from './pages/MatchViewer'
import { Compare } from './pages/Compare'
import { TeamViewer } from './pages/TeamViewer'

// await fetch("/stats")
// 	.then((response) => {
// 		response.json().then((result) => { console.log(result); });
// });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />}>
				<Route index element={<MatchViewer />} />
				<Route path="team-viewer" element={<TeamViewer />} />
				<Route path="compare" element={<Compare />} />
			</Route>
		</Routes>
	</BrowserRouter>
)
