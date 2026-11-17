import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[ 0 ]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    return (
        <div className="home-page">
            <header className="app-header">
                <button className="app-brand" onClick={() => navigate("/")}>
                    <span className="app-logo-dot" />
                    <span>PrePilot</span>
                </button>
                <nav className="app-nav" aria-label="Main navigation">
                    <button className="app-nav__item app-nav__item--active" onClick={() => navigate("/")}>New plan</button>
                    <button className="app-nav__item" onClick={() => document.querySelector(".recent-plans")?.scrollIntoView({ behavior: "smooth" })}>My plans</button>
                </nav>
                <button className="profile-dot" aria-label="Profile" />
            </header>

            <main className="home-content">
                <header className="page-header">
                    <h1>Your next interview,<br /><em>planned.</em></h1>
                    <p>Tell us the role and who you are. We handle the prep.</p>
                </header>

                <div className="interview-card">
                    <div className="interview-card__body">
                        <div className="panel panel--left">
                            <div className="panel__header">
                                <h2>Job description</h2>
                            </div>
                            <textarea
                                onChange={(e) => { setJobDescription(e.target.value) }}
                                className="panel__textarea"
                                placeholder="Paste the full job description here"
                                maxLength={5000}
                            />
                        </div>

                        <div className="panel panel--right">
                            <div className="upload-section">
                                <label className="section-label" htmlFor="resume">Resume <span>(PDF, up to 3 MB)</span></label>
                                <label className="dropzone" htmlFor="resume">
                                    <input ref={resumeInputRef} hidden type="file" id="resume" name="resume" accept=".pdf,.docx" />
                                    <span>Drop your resume or browse</span>
                                </label>
                            </div>

                            <div className="self-description">
                                <label className="section-label" htmlFor="selfDescription">Self description</label>
                                <textarea
                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                    id="selfDescription"
                                    name="selfDescription"
                                    className="panel__textarea panel__textarea--short"
                                    placeholder="Skills, projects, internships"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={handleGenerateReport} className="generate-btn">Generate my plan</button>

                {reports.length > 0 && (
                    <section className="recent-plans">
                        <h2>Recent plans</h2>
                        <div className="reports-grid">
                            {reports.map(report => (
                                <button key={report._id} className="report-card" onClick={() => navigate(`/interview/${report._id}`)}>
                                    <h3>{report.title || "Untitled position"}</h3>
                                    <p>{report.createdAt ? `Generated ${new Date(report.createdAt).toLocaleDateString()}` : "Generated recently"}</p>
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}

export default Home
