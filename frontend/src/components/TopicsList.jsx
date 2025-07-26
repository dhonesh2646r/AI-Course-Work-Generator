import React, { useEffect, useState } from 'react';
import { getTopics } from '../api';

const TopicsList = () => {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        getTopics().then(setTopics);
    }, []);

    return (
        <div>
            <h2>Topics</h2>
            <ul>
                {topics.map((topic) => (
                    <li key={topic.id}>{topic.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default TopicsList;
