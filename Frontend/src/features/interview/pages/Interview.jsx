import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical questions' },
    { id: 'behavioral', label: 'Behavioral questions' },
    { id: 'roadmap', label: 'Roadmap' },
]

const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className="q-card">
            <button className="q-card__header" onClick={() => setOpen(o => !o)}>
                <span className="q-card__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="q-card__question">{item.question}</span>
                <span className={`q-card__chevron ${open ? "q-card__chevron--open" : ""}`}>⌄</span>
            </button>
            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag">Why they ask</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">Model answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className="roadmap-day">
        <span className="roadmap-day__number">{day.day}</span>
        <div>
            <h3>{day.focus}</h3>
            <ul>
                {day.tasks.map((task, i) => <li key={i}>{task}</li>)}
            </ul>
        </div>
    </div>
)

const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    if (loading || !report) {
        return (
            <main className="loading-screen">
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    return (
        <div className="interview-page">
            <header className="interview-header">
                <button className="app-brand" onClick={() => navigate("/")}>
                    <span className="app-logo-dot" />
                    <span>PrePilot</span>
                </button>
                <nav className="interview-nav" aria-label="Interview plan sections">
                    <button onClick={() => navigate("/")}>New plan</button>
                    <button className="interview-nav__active" onClick={() => setActiveNav("technical")}>My plans</button>
                </nav>
                <button onClick={() => { getResumePdf(interviewId) }} className="resume-download">
                    Download tailored resume
                </button>
            </header>

            <section className="interview-hero">
                <div>
                    <span className="role-badge">Your interview plan</span>
                    <h1>{report.title || "Interview preparation"}</h1>
                    <p>Strong match. Close the gaps and you are ready.</p>
                </div>
                <div className="match-score">
                    <strong>{report.matchScore}<span>%</span></strong>
                    <p>Resume match</p>
                </div>
            </section>

            <main className="interview-layout">
                <section className="interview-main">
                    <nav className="section-tabs" aria-label="Plan categories">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={activeNav === item.id ? "section-tabs__active" : ""}
                                onClick={() => setActiveNav(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {activeNav === 'technical' && (
                        <section className="question-section">
                            <h2>Technical questions</h2>
                            <div className="q-list">
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className="question-section">
                            <h2>Behavioral questions</h2>
                            <div className="q-list">
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className="question-section">
                            <h2>Preparation roadmap</h2>
                            <div className="roadmap-list">
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </section>

                <aside className="interview-sidebar">
                    <section className="sidebar-card">
                        <h2>Skill gaps</h2>
                        <div className="skill-gaps__list">
                            {report.skillGaps.map((gap, i) => (
                                <div className="skill-row" key={i}>
                                    <div>
                                        <span>{gap.skill}</span>
                                        <span className={`severity severity--${gap.severity}`}>{gap.severity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="sidebar-card">
                        <h2>Preparation roadmap</h2>
                        <div className="sidebar-roadmap">
                            {report.preparationPlan.slice(0, 3).map((day) => (
                                <div className="sidebar-roadmap__item" key={day.day}>
                                    <span>{day.day}</span>
                                    <div><strong>{day.focus}</strong></div>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
            </main>
        </div>
    )
}

export default Interview
