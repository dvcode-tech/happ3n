import Head from "next/head";

export default function Header({
  title = "happ3n",
  description = "",
  icon = "/assets/logo/logo.png",
  preview = "",
  keywords = "",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href={icon} />

      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title} key="title" />
      <meta property="og:description" key="description" content={description} />

      <meta name="twitter:card" content={description} />
      <meta property="og:image" content={preview} />

      <meta property="og:keywords" key="keywords" content={keywords} />
      <meta property="og:type" content="website" />
    </Head>
  );
}
