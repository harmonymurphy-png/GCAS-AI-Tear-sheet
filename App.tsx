import React, { useState } from 'react';

// Data for the tear-sheet, parsed from the user's prompt
const tearSheetData = [
  {
    id: 1,
    title: "Gemini (via Vertex AI)",
    howItHelps: [
      "**Content Generation:** Quickly draft personalized outbound emails, follow-up messages, initial proposal summaries, or even internal communication based on specific customer context.",
      "**Research & Summarization:** Rapidly synthesize information from long customer meeting notes, industry reports, public financial statements, or competitor analyses to quickly grasp key insights.",
      "**Brainstorming:** Generate AppSheet use case ideas, solution approaches, or value propositions tailored to unique customer challenges and industries.",
      "**Q&A:** Get quick answers to complex questions about Google Cloud services, AppSheet capabilities, or market trends that you can then incorporate into your pitch.",
    ],
    keyBenefit: "Dramatically reduces the time spent on writing, research, and ideation, allowing you to focus on strategic selling.",
    resources: [
      { text: "Vertex AI Gemini API Overview", url: "https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview" },
      { text: "Google Cloud Skills Boost: Generative AI Learning Path", url: "https://www.cloudskillsboost.google/journeys/118" },
    ]
  },
  {
    id: 2,
    title: "Document AI",
    howItHelps: [
      "**Automated Data Extraction:** Extract key data points (e.g., requirements, deadlines, budget figures, named entities) from customer RFPs, contracts, invoices, or other structured/unstructured documents.",
      "**Faster Document Review:** Quickly identify specific clauses, terms, or performance metrics within long legal or operational documents without manual reading.",
      "**Populating AppSheet Apps:** Automatically feed extracted data into AppSheet applications for CRM updates, task management, or project tracking related to customer engagements.",
    ],
    keyBenefit: "Eliminates manual data entry and accelerates information retrieval from critical customer documents, freeing up your time for strategic interactions.",
    resources: [
      { text: "Document AI Processors", url: "https://cloud.google.com/document-ai/docs/processors-list" },
      { text: "Solution Guide: Intelligent Document Processing with Document AI", url: "https://cloud.google.com/architecture/intelligent-document-processing-document-ai" },
    ]
  },
  {
    id: 3,
    title: "Contact Center AI (CCAI) - Agent Assist",
    howItHelps: [
      "**Real-time Sales Support:** During live customer calls, Agent Assist provides real-time recommendations, pulling up relevant AppSheet features, common objections handling, competitor battle cards, or customer success stories pertinent to the conversation.",
      "**Instant Knowledge Retrieval:** Quickly access specific product details or technical answers without putting the customer on hold or fumbling through notes.",
    ],
    keyBenefit: "Improves your confidence and accuracy during customer interactions, leading to more productive calls and better sales outcomes.",
    resources: [
      { text: "Agent Assist Overview", url: "https://cloud.google.com/contact-center/docs/agent-assist/overview" },
      { text: "Blog: How Contact Center AI boosts agent productivity", url: "https://cloud.google.com/blog/products/ai-machine-learning/how-contact-center-ai-boosts-agent-productivity" },
    ]
  },
  {
    id: 4,
    title: "Vertex AI (Platform Capabilities - e.g., Vector Search)",
    howItHelps: [
      "**Rapid Knowledge Search:** Utilize Vertex AI's Vector Search to quickly find the most relevant AppSheet documentation, internal sales playbooks, customer success stories, or technical specifications using natural language queries.",
      "**Personalized Recommendations (if available internally):** Leverage pre-built or internal custom models on Vertex AI to receive AI-driven recommendations for next best actions, lead prioritization, or relevant upselling opportunities.",
    ],
    keyBenefit: "Get instant access to the exact information you need to support your sales efforts, without extensive manual searching.",
    resources: [
      { text: "Vertex AI Vector Search Overview", url: "https://cloud.google.com/vertex-ai/docs/matching-engine/overview" },
      { text: "Vertex AI Overview", url: "https://cloud.google.com/vertex-ai/docs/start/introduction-unified-platform" },
    ]
  },
  {
    id: 5,
    title: "AppSheet (as the Integration & Accessibility Layer)",
    howItHelps: [
      "**Custom AI-Powered Apps:** Build personal productivity apps (e.g., CRM extensions, sales trackers, lead qualification tools) that integrate directly with the AI services listed above.",
      "**Simplified AI Access:** Create no-code interfaces within AppSheet to trigger AI functions with a button click (e.g., \"Summarize this email thread with Gemini,\" \"Extract data from this RFP with Document AI\").",
      "**Automated Workflows:** Set up AppSheet automations that trigger AI processes based on your daily activities (e.g., \"When a new lead is added, use Gemini to draft a personalized intro email\").",
      "**Data Visualization of AI Insights:** Display AI-generated insights (e.g., extracted data, summarized text, recommended actions) directly within your AppSheet dashboards and reports.",
    ],
    keyBenefit: "Makes powerful Google AI accessible and actionable for you and your team through easy-to-use, no-code applications, automating repetitive tasks and streamlining workflows.",
    resources: [
      { text: "AppSheet and AI Integrations", url: "https://www.appsheet.com/en/features/appsheet-ai-integrations" },
      { text: "AppSheet Learning Center", url: "https://www.appsheet.com/support/documentation/learning" },
    ]
  }
];

// Simple markdown-like parser for bold text
const FormattedText = ({ text }: { text: string }) => {
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return (
        <span>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
                }
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};

// SVG Icons
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-400 group-hover:text-blue-600 transition-colors">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const TearSheetCard = ({ item }: { item: typeof tearSheetData[0] }) => {
    return (
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <header className="p-6 bg-gray-50 border-b border-gray-200/80">
                <h2 className="text-2xl font-bold text-gray-800">
                    <span className="text-blue-600 mr-3">{item.id}.</span>{item.title}
                </h2>
            </header>
            <div className="p-6 md:p-8 space-y-6">
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">How it Helps Your Day-to-Day:</h3>
                    <ul className="space-y-3 text-gray-600">
                        {item.howItHelps.map((point, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircleIcon />
                                <span className="ml-3"><FormattedText text={point} /></span>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="bg-blue-50/70 border border-blue-200/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                        <LightbulbIcon />
                        Key Benefit:
                    </h3>
                    <p className="text-blue-700 font-medium">{item.keyBenefit}</p>
                </section>
                <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Actionable Resource:</h3>
                    <ul className="space-y-2">
                        {item.resources.map((resource, index) => (
                            <li key={index}>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors group font-medium">
                                    <LinkIcon />
                                    <span>{resource.text}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </article>
    );
};


const Header = ({ onDownload, isDownloading }: { onDownload: () => void; isDownloading: boolean; }) => (
    <header className="text-center py-12 md:py-16 px-4 bg-white border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            Google AI Power-Ups for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">GCAS Sales Productivity</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            This guide highlights key Google AI products and how they can directly enhance your daily sales tasks, often with AppSheet as the accessible front-end.
        </p>
        <div className="mt-8">
            <button
                onClick={onDownload}
                disabled={isDownloading}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
                <DownloadIcon />
                {isDownloading ? 'Generating Doc...' : 'Download as Google Doc'}
            </button>
            <p className="mt-3 text-sm text-gray-500">
                Downloads a .docx file, which can be uploaded to Google Drive and opened as a Google Doc.
            </p>
        </div>
    </header>
);

const App: React.FC = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const generateHtmlForDoc = () => {
        // Styles adjusted for better DOCX compatibility.
        // Using points (pt) for font sizes is better for documents.
        const styles = `
            <style>
                body { font-family: Arial, sans-serif; color: #333333; line-height: 1.6; }
                h1 { font-size: 24pt; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold; }
                h1 span { color: #4285F4; }
                h2 { font-size: 18pt; color: #1a202c; background-color: #f7fafc; padding: 10px; border-left: 4px solid #4285F4; margin-top: 30px; margin-bottom: 20px; font-weight: bold; }
                h3 { font-size: 14pt; color: #2d3748; margin-bottom: 10px; font-weight: bold; }
                p, li { font-size: 12pt; color: #4a5568; }
                ul { list-style-type: none; padding-left: 0; }
                li { margin-bottom: 12px; }
                strong { color: #1a202c; font-weight: bold; }
                a { color: #3182ce; text-decoration: none; }
                .key-benefit { background-color: #ebf8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 15px; margin: 20px 0; }
                .key-benefit h3 { color: #2c5282; margin-top:0; }
                .key-benefit p { color: #2b6cb0; font-weight: 500; }
                .resource-link { display: block; margin-bottom: 8px; }
                footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #718096; font-style: italic; }
            </style>
        `;
    
        const formatText = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
        const headerHtml = `
            <h1>Google AI Power-Ups for <span>GCAS Sales Productivity</span></h1>
            <p>This guide highlights key Google AI products and how they can directly enhance your daily sales tasks, often with AppSheet as the accessible front-end.</p>
        `;
    
        const footerHtml = `
            <footer>
                <p>By leveraging these Google AI products, especially in conjunction with AppSheet, you can significantly enhance your efficiency, improve your customer interactions, and ultimately drive more successful outcomes in your daily sales activities. Embrace these tools to transform your approach!</p>
            </footer>
        `;
    
        const contentHtml = tearSheetData.map(item => `
            <article>
                <h2>${item.id}. ${item.title}</h2>
                <h3>How it Helps Your Day-to-Day:</h3>
                <ul>
                    ${item.howItHelps.map(point => `<li><span style="color: #4285F4; margin-right: 8px;">✔</span>${formatText(point.substring(point.indexOf(':') + 1).trim())}</li>`).join('')}
                </ul>
                <div class="key-benefit">
                    <h3>Key Benefit:</h3>
                    <p>${item.keyBenefit}</p>
                </div>
                <h3>Actionable Resource:</h3>
                ${item.resources.map(res => `<a class="resource-link" href="${res.url}">${res.text}</a>`).join('')}
            </article>
        `).join('');
    
        // Return only the content for the body, including styles. Not a full HTML document.
        return `
            ${styles}
            ${headerHtml}
            <main>${contentHtml}</main>
            ${footerHtml}
        `;
    };
    

    const handleDownload = async () => {
        if (!(window as any).htmlToDocx) {
            alert('Error: The document generation library is not available.');
            return;
        }

        setIsDownloading(true);
        try {
            const htmlString = generateHtmlForDoc();
            const fileBuffer = await (window as any).htmlToDocx(htmlString, null, {
                orientation: 'portrait',
                margins: { top: 720, right: 720, bottom: 720, left: 720 }, // 1 inch margins
            });

            const blob = new Blob([fileBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'GCAS-Sales-Productivity-Tear-Sheet.docx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

        } catch (error) {
            console.error('Error generating DOCX file:', error);
            alert('An error occurred while generating the document.');
        } finally {
            setIsDownloading(false);
        }
    };
  
    return (
        <div className="min-h-screen bg-gray-100 text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Header onDownload={handleDownload} isDownloading={isDownloading} />
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-12">
                    {tearSheetData.map((item) => (
                        <TearSheetCard key={item.id} item={item} />
                    ))}
                </div>
            </main>
            <footer className="text-center py-10 px-4 mt-8 bg-gray-200/50 text-gray-600">
                <div className="max-w-4xl mx-auto">
                    <p className="italic">
                        By leveraging these Google AI products, especially in conjunction with AppSheet, you can significantly enhance your efficiency, improve your customer interactions, and ultimately drive more successful outcomes in your daily sales activities. Embrace these tools to transform your approach!
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;
