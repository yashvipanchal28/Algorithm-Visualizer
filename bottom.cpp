int main()
{
    cout << "{\"data\":[";
    solve();
    cout << "],";
    cout << "\"type\":";
    if (flag_graph)
        cout << "\"Graph\"";
    else if (flag_vector)
        cout << "\"Vector\"";
    else
        cout << "\"Blank\"";
    cout << "}";
}