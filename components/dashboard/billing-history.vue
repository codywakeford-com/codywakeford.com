<script setup lang="ts">
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)

const reciepts = computed(() => {
    return $User.getReciepts
})

// const reciepts = [
//     {
//         id: "1",
//         description: "this is the payment description",
//         date: "March 24 2024",
//         status: "pending",
//         amount: "£1000.00",
//     },
//     {
//         id: "1",
//         description: "this is the payment description",
//         date: "March 24 2024",
//         status: "pending",
//         amount: "£1000.00",
//     },
//     {
//         id: "1",
//         description: "this is the payment description",
//         date: "March 24 2024",
//         status: "pending",
//         amount: "£1000.00",
//     },
//     {
//         id: "1",
//         description: "this is the payment description",
//         date: "March 24 2024",
//         status: "pending",
//         amount: "£1000.00",
//     },
//     {
//         id: "1",
//         description: "this is the payment description",
//         date: "March 24 2024",
//         status: "pending",
//         amount: "£1000.00",
//     },
//     {
//         id: "1",
//         description: "this is the payment description",
//         date: "March 24 2024",
//         status: "pending",
//         amount: "£1000.00",
//     },
// ]
</script>

<template>
    <section>
        <div class="billing-history">
            <header>
                <div class="left">
                    <h2>Billing History</h2>
                    <p>View all payments made to codywakeford.com</p>
                </div>

                <div class="right">
                    <label for="">Balance</label>
                    <div class="balance">-£762.27</div>
                </div>
            </header>

            <table>
                <thead>
                    <tr>
                        <th>Transaction Id</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(reciept, index) in reciepts">
                        <td>{{ reciept.id }}</td>
                        <td>{{ reciept.description }}</td>
                        <td>{{ dayjs(reciept.timestamp).format("dddd Do MMM HH:mma") }}</td>
                        <td>completed</td>
                        <td>£{{ (reciept.totalPaid / 100).toFixed(2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style lang="scss" scoped>
section {
    background: white;
    position: relative;
    padding: 25px;
    margin-top: 25px;
    border-radius: $border-radius;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 5px;
    margin-bottom: 10px;

    .left,
    .right {
        display: flex;
        gap: 3px;
        flex-direction: column;
    }

    .right {
        text-align: right;

        label {
            font-size: 0.8rem;
            color: $text-light3;
        }

        .balance {
            font-size: 2rem;
            font-weight: bold;
            text-align: right;
            line-height: 1;
        }
    }

    p {
        font-size: 0.9rem;
        color: $text-dark3;
    }
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 16px;
    text-align: left;
}

th,
td {
    padding: 15px 10px;
}

tbody {
    display: block;
    height: 700px;
    overflow: auto;
}

thead,
tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed; /* even columns width , fix width of table too*/
}

thead {
    tr {
        background: $secondary;
    }
}

tr:nth-child(even) {
    background-color: #f9f9f9;
}
</style>
