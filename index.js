/******************************************************************************
 * @copyright       Apache License Version 2.0, January 2004
 * @version         0.0.1
 *
 * @file            index.js
 * @author          Mickael Valmier <mickael.valmier@gmail.com>
 * @last-edited     17-10-2016
 * @description     Queuing synchronized access to a shared resource
 *****************************************************************************/
'use strict';

const
    Q           = require('q'),
    bootstrap   = Q.defer();

// Resolve bootstrap is required to engage the first process
bootstrap.resolve();

const Flowrida = {
    // {Array<Deffered>}    Deferred processes currently stacked
    stacked : [bootstrap],
    // {Integer}            Number of processes added to stack
    count: 0,


    /**
     * Stack a new process in the processing cell
     * 
     * @params  {Object}    props   Properties defined for this process
     * 
     * @result  {Flowrida}  Current instance of module for chaining functions
     */
    stack(props) {
        // {Integer}    Index assigned to the new process
        let index       = this.count++,
        // {Deffered}   Deffered process for queuing newcomer treatment
            incomer     = Q.defer(),
        // {Deffered}   Last deferred process added into stack
            neighbour   = this.stacked[0];


        // Push newcomer into stack and waiting process
        this.stacked.unshift(incomer);

        // Wait treatment neighbor before launch new process
        Q.when(neighbour.promise, _ => this.process(incomer, props, index));

        return this;
    },


    /**
     * Treat a deffered process and pop out from stack
     * 
     * @param {Deferred}    deferred    Deferred process to treat
     * @param {Object}      props       Properties defined for this process
     * @param {Integer}     index       Index assigned to the new process
     */
    process(deferred, props, index)
    {
        console.log('Launch process#%d', index, props);

        // Popping process once treated
        this.stacked.pop();

        // Resolve deferred process once pop out
        deferred.resolve(props);
    }
};

module.exports = Flowrida;