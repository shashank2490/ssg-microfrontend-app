import Head from 'next/head'
import styles from '../styles/App.module.scss'
import { useRouter } from 'next/router'
import Layout from '../components/layout';
import { GameType } from '../interfaces/GameType';


export default function Home() {
  const router = useRouter();

  const onClickGameButton = (game) => (event) => {
    router.push(`/games/${game}`);
  }

  return (
    <Layout>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Home</title>
      </Head>
      <div className={styles.home}>
        <div className={styles.home__header}>
          <h2>Choose your GAME!!</h2>
        </div>
        <div className={styles.home__actioncontainer}>
          <button className={styles.home__actioncontainer__button} onClick={onClickGameButton(GameType.HangMan.name)}>
            {GameType.HangMan.title}
          </button>
          <button className={styles.home__actioncontainer__button} onClick={onClickGameButton(GameType.TicTacToe.name)}>
            {GameType.TicTacToe.title}
          </button>
        </div>
      </div>
    </Layout>
  );
}
