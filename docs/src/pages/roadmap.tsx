import {
  mdiServer,
  mdiWizardHat
} from '@mdi/js';
import Layout from '@theme/Layout';
import React from 'react';
import { Item, Timeline } from '../components/timeline';

const releases = {
  'v2.2.2': new Date(2023, 5, 13),
  'v2.1.2': new Date(2023, 4, 5),
} as const;

const weirdTags = {
  'v1.0.0': 'v1.0.0_1-dev',
};

const title = 'Roadmap';
const description = 'A list of future plans and goals, as well as past achievements and milestones.';

const withLanguage = (date: Date) => (language: string) => date.toLocaleDateString(language);

type Base = { icon: string; iconColor?: React.CSSProperties['color']; title: string; description: string };
const withRelease = ({
  icon,
  iconColor,
  title,
  description,
  release: version,
}: Base & { release: keyof typeof releases }) => {
  return {
    icon,
    iconColor: iconColor ?? 'gray',
    title,
    description,
    link: {
      url: `https://github.com/wizarrrrr/wizarr/releases/tag/${weirdTags[version] ?? version}`,
      text: version,
    },
    getDateLabel: withLanguage(releases[version]),
  };
};

const roadmap: Item[] = [
  {
    done: false,
    icon: mdiServer,
    iconColor: 'gold',
    title: 'Multi-Server Support',
    description: 'Support for multiple servers on the same instance of Wizarr',
    getDateLabel: () => 'Planned for 2025',
  }
];

const milestones: Item[] = [
  withRelease({
    icon: mdiWizardHat,
    iconColor: '#FF4155',
    title: 'Wizarr\'s Birthday',
    description: 'Wizarr is born!',
    release: 'v2.1.2',
  }),
];

export default function MilestonePage(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <section className="my-8">
        <h1 className="md:text-6xl text-center mb-10 text-immich-primary dark:text-immich-dark-primary px-2">
          {title}
        </h1>
        <p className="text-center text-xl px-2">{description}</p>
        <div className="flex justify-around mt-8 w-full max-w-full">
          <Timeline items={[...roadmap, ...milestones]} />
        </div>
      </section>
    </Layout>
  );
}
