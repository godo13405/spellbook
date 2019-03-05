'use strict';

const text = require('./_textTools.js'),
    tools = {
        damage: subjectDamage => {
            let damage = false;
            if (subjectDamage) {
                damage = [];
                subjectDamage.forEach(x => {
                    damage.push(`${x.amount}${x.dice} ${x.type} damage`);
                });
                damage = damage.join(', ');
            }

            return damage;
        },
        subtitle: (subject, preposition = true) => {
            let level;
            if (!subject.level) {
                level = `${text.capitalize(subject.school)} cantrip`;
            } else {
                level = `level ${subject.level} ${text.capitalize(subject.school)} spell`;
            }
            if (preposition) {
                level = `${text.preposition(subject.school)} ${level}`;
            }

            return level;
        }
    };

exports = module.exports = tools;