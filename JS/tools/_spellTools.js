'use strict';

const tools = {
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
    }
};

exports = module.exports = tools;