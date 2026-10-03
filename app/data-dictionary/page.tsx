import { NativeLink as Link } from "../native-link";
import { dataClassification, eventDefinitions, referenceFramework, standardAbbreviations, timeBasisDefinitions } from "../../lib/port-call-data";

export default function DataDictionaryPage() {
  return <main className="dictionaryPage">
    <header className="simpleTop"><Link className="brand" href="/"><b>14</b><span>VHF14<small>PORT OPERATIONS INTELLIGENCE</small></span></Link><nav><Link href="/">Operations</Link><Link href="/legal/data">Data policy</Link></nav></header>
    <article className="dictionaryIntro">
      <p className="kicker">REFERENCE · BETA</p>
      <h1>Port Call Data Dictionary</h1>
      <p>Clear definitions for the operational milestones shown in VHF14. The interface stays concise; this reference explains the meaning behind each report.</p>
      <aside><b>Reference framework.</b> The model is designed with reference to {referenceFramework.sources.join(", ")}. It is not a certification or an official navigational information service.</aside>
    </article>

    <section className="dictionarySection">
      <div className="dictionaryHeading"><p className="kicker">TIME</p><h2>Time basis</h2><p>Requested is reserved for future controlled workflows and is not currently available in the reporting interface.</p></div>
      <div className="definitionGrid">{timeBasisDefinitions.map(item=><article key={item.code} className={"definitionCard"+("reserved" in item?" reserved":"")}><span>{item.abbreviation}</span><h3>{item.label}</h3><p>{item.definition}</p><small>{item.imoPattern}{"reserved" in item?" · Reserved":""}</small></article>)}</div>
    </section>

    <section className="dictionarySection abbreviationSection">
      <div className="dictionaryHeading"><p className="kicker">IMO / PCO</p><h2>Standard abbreviations</h2><p>These abbreviations identify the time type and the action. A location or service qualifier is added where needed: for example, ATA Berth, PTA PBP or ATC Cargo service.</p></div>
      <div className="abbreviationGrid">{standardAbbreviations.map(item=><article key={item.abbreviation}><b>{item.abbreviation}</b><div><h3>{item.term}</h3><p>{item.family}</p></div></article>)}</div>
      <p className="dictionaryBoundary"><b>Important:</b> familiar operational shorthand is not presented as an IMO abbreviation unless the referenced standard defines it. For example, Pilot on Board is not labelled ATA PBP because those events are not identical.</p>
    </section>

    <section className="dictionarySection">
      <div className="dictionaryHeading"><p className="kicker">PORT CALL</p><h2>Operational milestones</h2><p>Shifting and anchorage are contextual. They appear only when reported and remain within the same port call.</p></div>
      <div className="eventDictionary">{eventDefinitions.map(item=><article key={item.code}><div><span>{item.phase}</span><h3>{item.event}</h3><strong>{item.standard}</strong></div><p>{item.definition}</p><div><small>{item.location}</small><em>{item.standardNote}</em></div></article>)}</div>
    </section>

    <section className="dictionarySection evidenceSection">
      <div className="dictionaryHeading"><p className="kicker">EVIDENCE</p><h2>Report status</h2></div>
      <div className="definitionGrid three"><article className="definitionCard"><span>01</span><h3>Reported</h3><p>Submitted in good faith and visible as awaiting authorised review.</p></article><article className="definitionCard"><span>02</span><h3>Confidence</h3><p>Independent agreement may increase evidential confidence but does not grant verification authority.</p></article><article className="definitionCard"><span>03</span><h3>Verified</h3><p>Reviewed by an authorised human source or VHF14 review process. During beta, only an Administrator can grant this status.</p></article></div>
    </section>

    <section className="dictionarySection classificationSection">
      <div className="dictionaryHeading"><p className="kicker">VISIBILITY</p><h2>Data classification</h2><p>Operational reporting remains open and practical. Classification protects information that should not appear on the public timeline.</p></div>
      <dl><div><dt>Public operational data</dt><dd>{dataClassification.public}</dd></div><div><dt>Restricted professional data</dt><dd>{dataClassification.restricted}</dd></div><div><dt>Internal control data</dt><dd>{dataClassification.internal}</dd></div></dl>
      <p className="dictionaryBoundary">Do not submit personal data, security-sensitive information, confidential instructions or navigational information not authorised for publication.</p>
    </section>
    <footer><span>VHF14 · PORT OPERATIONS INTELLIGENCE</span><nav><Link href="/">Operations</Link><Link href="/contact">Contact</Link><Link href="/legal/data">Data & verification</Link></nav></footer>
  </main>;
}
