import { useContext } from 'react';
import { LanguageContext } from './context';
import {
  translations,
  localizedCandidates,
  localizedConstituencies,
  localizedParties,
  localizedElections,
  localizedTopics,
  localizedPolicies,
  localizedResources
} from './translations';

export function useLanguage() {
  const { language, setLanguage } = useContext(LanguageContext);

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const getCandidateName = (candidate) => {
    if (!candidate) return '';
    return localizedCandidates[candidate.id]?.name?.[language] || candidate.name;
  };

  const getCandidateEducation = (candidate) => {
    if (!candidate) return '';
    return localizedCandidates[candidate.id]?.education?.[language] || candidate.education?.split(',')[0];
  };

  const getCandidateWealth = (candidate) => {
    if (!candidate) return '';
    return localizedCandidates[candidate.id]?.wealth?.[language] || candidate.declaredAssets;
  };

  const getCandidateBio = (candidate) => {
    if (!candidate) return '';
    return localizedCandidates[candidate.id]?.bio?.[language] || candidate.biography;
  };

  const getConstituencyName = (constituency) => {
    if (!constituency) return '';
    return localizedConstituencies[constituency.id]?.name?.[language] || constituency.name;
  };

  const getConstituencyDistrict = (constituency) => {
    if (!constituency) return '';
    return localizedConstituencies[constituency.id]?.district?.[language] || constituency.district;
  };

  const getPartyName = (party) => {
    if (!party) return '';
    return localizedParties[party.id]?.name?.[language] || party.name;
  };

  const getPartyShortName = (party) => {
    if (!party) return '';
    return localizedParties[party.id]?.shortName?.[language] || party.shortName;
  };

  const getPartyIdeology = (party) => {
    if (!party) return '';
    return localizedParties[party.id]?.ideology?.[language] || party.ideology;
  };

  const getPartyDescription = (party) => {
    if (!party) return '';
    return localizedParties[party.id]?.description?.[language] || party.description;
  };

  const getElectionName = (election) => {
    if (!election) return '';
    return localizedElections[election.id]?.name?.[language] || election.name;
  };

  const getElectionState = (election) => {
    if (!election) return '';
    return localizedElections[election.id]?.state?.[language] || election.state;
  };

  const getElectionType = (election) => {
    if (!election) return '';
    return localizedElections[election.id]?.type?.[language] || election.type;
  };

  const getElectionStatus = (election) => {
    if (!election) return '';
    return localizedElections[election.id]?.status?.[language] || election.status;
  };

  const getElectionPollingDate = (election) => {
    if (!election) return '';
    return localizedElections[election.id]?.pollingDate?.[language] || election.pollingDate;
  };

  const getElectionCountingDate = (election) => {
    if (!election) return '';
    return localizedElections[election.id]?.countingDate?.[language] || election.countingDate;
  };

  const getTopicLabel = (topicKey) => {
    return localizedTopics[topicKey]?.[language] || topicKey;
  };

  const getPolicyPosition = (policy) => {
    if (!policy) return '';
    return localizedPolicies[policy.id]?.position?.[language] || policy.position;
  };

  const getResourceTitle = (resource) => {
    if (!resource) return '';
    return localizedResources[resource.id]?.title?.[language] || resource.title;
  };

  const getResourceDescription = (resource) => {
    if (!resource) return '';
    return localizedResources[resource.id]?.description?.[language] || resource.description;
  };

  const getResourceCategory = (resource) => {
    if (!resource) return '';
    return localizedResources[resource.id]?.category?.[language] || resource.category;
  };

  return {
    language,
    setLanguage,
    t,
    getCandidateName,
    getCandidateEducation,
    getCandidateWealth,
    getCandidateBio,
    getConstituencyName,
    getConstituencyDistrict,
    getPartyName,
    getPartyShortName,
    getPartyIdeology,
    getPartyDescription,
    getElectionName,
    getElectionState,
    getElectionType,
    getElectionStatus,
    getElectionPollingDate,
    getElectionCountingDate,
    getTopicLabel,
    getPolicyPosition,
    getResourceTitle,
    getResourceDescription,
    getResourceCategory
  };
}
