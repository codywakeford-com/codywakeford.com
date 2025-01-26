<script setup lang="ts">
const reciepts = [
    {
        id: "1",
        description: "this is the payment description",
        date: "March 24 2024",
        status: "pending",
        amount: "£1000.00",
    },
    {
        id: "1",
        description: "this is the payment description",
        date: "March 24 2024",
        status: "pending",
        amount: "£1000.00",
    },
    {
        id: "1",
        description: "this is the payment description",
        date: "March 24 2024",
        status: "pending",
        amount: "£1000.00",
    },
    {
        id: "1",
        description: "this is the payment description",
        date: "March 24 2024",
        status: "pending",
        amount: "£1000.00",
    },
    {
        id: "1",
        description: "this is the payment description",
        date: "March 24 2024",
        status: "pending",
        amount: "£1000.00",
    },
    {
        id: "1",
        description: "this is the payment description",
        date: "March 24 2024",
        status: "pending",
        amount: "£1000.00",
    },
]
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
                        <td>{{ reciept.date }}</td>
                        <td>{{ reciept.status }}</td>
                        <td>{{ reciept.amount }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style lang="scss" scoped>
section {
    background: white;
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

thead {
    tr {
        background: $secondary;
    }
}

tr:nth-child(even) {
    background-color: #f9f9f9;
}
</style>
