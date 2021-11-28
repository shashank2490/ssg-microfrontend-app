import Link from 'next/link'
import styles from '../styles/App.module.scss'

export default function Layout({ children }) {
  return (
    <div className={styles.app}>
      <header className={styles.app__header}>
        <h1 className={styles.app__header__heading}><Link href="/">My Micro Front-End App</Link></h1>
      </header>
      <div className={styles.app__body}>
        {children}
      </div>
    </div>
  )
}