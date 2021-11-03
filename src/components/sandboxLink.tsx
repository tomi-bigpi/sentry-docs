import React from "react";
import usePlatform from "./hooks/usePlatform";

type Props = {
    children: React.ReactNode;
    scenario: string;
    projectSlug: string;
    errorType: string;
    platform?: string;
}

/**
 * 
 * @param param0.scenario: One of the scenarios. Available scenarios include:
 * performance, releases, alerts, discover, dashboards, projects,
 * oneDiscoverQuery, oneIssue, oneBreadcrumb, oneStackTrace, oneTransaction,
 * oneWebVitals, oneTransactionSummary, oneRelease
 * @param param0.projectSlug:
 * One of react, python, react-native, android, iOS
 * @param param0.errorType: A string matching the title of the error.
 * @returns URL to the sandbox start endpoint
 */
export function getSandboxURL({ scenario, projectSlug, errorType }: {
  scenario?: string,
  projectSlug?: string,
  errorType?: string,
} = {}) {
  const url = new URL('https://try.sentry-demo.com/demo/start/');

  if (scenario) url.searchParams.append('scenario', scenario);

  if (projectSlug) url.searchParams.append('projectSlug', projectSlug);

  if (errorType) url.searchParams.append('errorType', errorType);
  url.searchParams.append('source', 'docs');

  return url;
};

export const isSandboxHidden = () => process.env.GATSBY_HIDE_SANDBOX === '1';

const SANDBOX_PLATFORMS: string[] = [
    'react',
    'python',
    'react-native',
    'android',
    'ios',
];

const SANDBOX_PLATFORM_MAP: { [key: string]: string } = {
    apple: 'ios',
    javascript: 'react',
    node: 'react',
};

export default function SandboxLink({ children, platform, ...params }: Props) {
    if (isSandboxHidden()) {
        return children;
    }
    const [currentPlatform] = usePlatform(platform);
    if (!params.projectSlug) {
        if (SANDBOX_PLATFORMS.includes(currentPlatform.key)) {
            params.projectSlug = currentPlatform.key;
        } else if (SANDBOX_PLATFORM_MAP[currentPlatform.key]) {
            params.projectSlug = SANDBOX_PLATFORM_MAP[currentPlatform.key];
        }
    }

    return <a href={getSandboxURL(params).toString()}>{children}</a>;
}
